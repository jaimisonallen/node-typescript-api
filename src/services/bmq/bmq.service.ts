import { Queue, Worker, QueueEvents } from "bullmq";

export default class BMQService {
  public async execute() {
    const connection = {
      host: "127.0.0.1",
      port: 6379,
    };

    const myQueue = new Queue("myqueue", {
      connection,
    });
    const queueEvents = new QueueEvents("myqueue", {
      connection,
    });

    const worker = new Worker(
      "foo",
      async (job) => {
        // Will print { foo: 'bar'} for the first job
        // and { qux: 'baz' } for the second.
        console.log(job.data);
      },
      {
        connection,
      }
    );

    async function addJobs() {
      await myQueue.add("myJobName", { foo: "bar" });
      await myQueue.add("myJobName", { qux: "baz" });
    }

    await addJobs();

    worker.on("completed", (job) => {
      console.log(`${job.id} has completed!`);
    });

    worker.on("failed", (job, err) => {
      if (job) {
        console.log(`${job.id} has failed with ${err.message}`);
      }
    });

    queueEvents.on("waiting", ({ jobId }) => {
      console.log(`A job with ID ${jobId} is waiting`);
    });

    queueEvents.on("active", ({ jobId, prev }) => {
      console.log(`Job ${jobId} is now active; previous status was ${prev}`);
    });

    queueEvents.on("completed", ({ jobId, returnvalue }) => {
      console.log(`${jobId} has completed and returned ${returnvalue}`);
    });

    queueEvents.on("failed", ({ jobId, failedReason }) => {
      console.log(`${jobId} has failed with reason ${failedReason}`);
    });
  }
}
