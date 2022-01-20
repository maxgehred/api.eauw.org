import Bull from "bull";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";
import process from "process";

import sendNewEmail from "../processes/email.process";
import addToGroups from "../processes/groups.process";
import addToSpreadsheet from "../processes/spreadsheet.process";

const emailQueue = new Bull("emailQueue", {
  redis: process.env.REDIS_URL
});

const serverAdapter = new ExpressAdapter();

const {
  addQueue, removeQueue, setQueues, replaceQueues
} = createBullBoard({
  queues: [new BullAdapter(emailQueue)],
  serverAdapter
});

emailQueue.process(sendNewEmail);
emailQueue.process(addToGroups);
emailQueue.process(addToSpreadsheet);

const addNewEmail = (email: string, firstName: string) => {
  emailQueue.add([email, firstName], {
    attempts: 5
  });
};

export default addNewEmail;
