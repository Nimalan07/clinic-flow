const supabase = require("./supabase");

let currentToken = null;
let isProcessing = false;

async function getAverageConsultationTime() {
  const { data, error } = await supabase
    .from("patients")
    .select("consultation_duration")
    .not("consultation_duration", "is", null);

  if (error) {
    console.error(error);
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  const total = data.reduce(
    (sum, row) => sum + row.consultation_duration,
    0
  );

  return Math.max(
    1,
    Math.round(total / data.length)
  );
}

async function getQueueData() {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .order("token");

  if (error) {
    console.error(error);

    return {
      queue: [],
      currentToken: null,
      averageConsultationTime: 10,
    };
  }

  // Find the token of the patient who has status === 'serving'
  const servingPatient = (data || []).find(p => p.status === "serving");
  const activeToken = servingPatient ? servingPatient.token : null;

  // Sync the local currentToken in case it was out of sync (e.g. after server restart)
  if (activeToken !== null) {
    currentToken = activeToken;
  }

  return {
    queue: data || [],
    currentToken: activeToken,
    averageConsultationTime:
      await getAverageConsultationTime(),
  };
}

async function addPatient(name) {
  const { data: duplicate } =
    await supabase
      .from("patients")
      .select("*")
      .eq("name", name)
      .neq("status", "completed");

  if (
    duplicate &&
    duplicate.length > 0
  ) {
    return {
      success: false,
      message:
        "Patient already exists in queue",
    };
  }

  const { data: lastPatient } =
    await supabase
      .from("patients")
      .select("token")
      .order("token", {
        ascending: false,
      })
      .limit(1);

  const nextToken =
    lastPatient &&
    lastPatient.length > 0
      ? lastPatient[0].token + 1
      : 1;

  const { error } =
    await supabase
      .from("patients")
      .insert([
        {
          token: nextToken,
          name,
          status: "waiting",
        },
      ]);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
  };
}

async function callNext() {
  if (isProcessing)
    return null;

  isProcessing = true;

  try {
    // Complete currently serving patient
    let activeToken = currentToken;
    if (!activeToken) {
      const { data: serving } = await supabase
        .from("patients")
        .select("token")
        .eq("status", "serving")
        .limit(1);
      if (serving && serving.length > 0) {
        activeToken = serving[0].token;
        currentToken = activeToken;
      }
    }

    if (activeToken) {
      const { data: currentPatient } =
        await supabase
          .from("patients")
          .select("*")
          .eq(
            "token",
            activeToken
          )
          .single();

      if (
        currentPatient &&
        currentPatient.start_time
      ) {
        const start =
          new Date(
            currentPatient.start_time
          );

        const end = new Date();

        const duration =
          Math.max(
            1,
            Math.round(
              (end - start) /
                60000
            )
          );

        await supabase
          .from("patients")
          .update({
            status: "completed",
            end_time:
              end.toISOString(),
            consultation_duration:
              duration,
          })
          .eq(
            "token",
            activeToken
          );
      }
    }

    // Get next waiting patient
    const { data: waiting } =
      await supabase
        .from("patients")
        .select("*")
        .eq(
          "status",
          "waiting"
        )
        .order("token")
        .limit(1);

    if (
      !waiting ||
      waiting.length === 0
    ) {
      currentToken = null;
      return null;
    }

    const nextPatient =
      waiting[0];

    await supabase
      .from("patients")
      .update({
        status: "serving",
        start_time:
          new Date().toISOString(),
      })
      .eq(
        "token",
        nextPatient.token
      );

    currentToken =
      nextPatient.token;

    return nextPatient;
  } finally {
    isProcessing = false;
  }
}
async function resetQueue() {
  await supabase
    .from("patients")
    .delete()
    .neq("id", 0);

  currentToken = null;

  return true;
}
module.exports = {
  getQueueData,
  addPatient,
  callNext,
  resetQueue,
};