const {
  addPatient,
  callNext,
  getQueueData,
  resetQueue,
} = require("./queueManager");
function setupSocket(io) {
  io.on(
    "connection",
    async (socket) => {
      console.log(
        "Connected:",
        socket.id
      );

      socket.emit(
        "queueUpdated",
        await getQueueData()
      );

      socket.on(
        "addPatient",
        async (name) => {
          const result =
            await addPatient(name);

          if (
            !result.success
          ) {
            socket.emit(
              "errorMessage",
              result.message
            );
            return;
          }

          io.emit(
            "queueUpdated",
            await getQueueData()
          );
        }
      );

      socket.on(
        "callNext",
        async () => {
          await callNext();

          io.emit(
            "queueUpdated",
            await getQueueData()
          );
        }
      );
      socket.on(
        "resetQueue",
        async () => {
          await resetQueue();

          io.emit(
            "queueUpdated",
            await getQueueData()
          );
        }
      );

      socket.on(
        "requestQueue",
        async () => {
          socket.emit(
            "queueUpdated",
            await getQueueData()
          );
        }
      );
    }
  );
}

module.exports = setupSocket;