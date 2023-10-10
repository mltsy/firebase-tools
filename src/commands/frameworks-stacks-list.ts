import { Command } from "../command";
import { Options } from "../options";
import { needProjectId } from "../projectUtils";
import * as gcp from "../gcp/frameworks";
import { FirebaseError } from "../error";

export const command = new Command("stacks:list")
  .description("List stacks of a Firebase project.")
  .option("-l, --location <location>", "Stack backend location", "us-central1")
  .action(async (options: Options) => {
    const projectId = needProjectId(options);
    const location = options.location as string;
    if (!location) {
      throw new FirebaseError("Location can't be empty.");
    }

    try {
      const stacks = await gcp.listStack(projectId, location);
      console.log(stacks);
    } catch (err: any) {
      throw new FirebaseError(
        `Unable to list stacks present in project: ${projectId}. Please check the parameters you have provided.`
      );
    }
  });
