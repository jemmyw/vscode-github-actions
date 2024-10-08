import * as vscode from "vscode";
import {GitHubRepoContext} from "../../git/repository";
import {WorkflowJob} from "../../store/WorkflowJob";
import {getIconForWorkflowRun} from "../icons";
import {WorkflowStepNode} from "../workflows/workflowStepNode";
import {WorkflowJobGroup} from "../../store/WorkflowJobGroup";
import {WorkflowJobNode} from "./workflowJobNode";

export class WorkflowJobGroupNode extends vscode.TreeItem {
  constructor(public readonly gitHubRepoContext: GitHubRepoContext, public readonly group: WorkflowJobGroup) {
    super(group.name, vscode.TreeItemCollapsibleState.Collapsed);

    this.contextValue = "group";
    if (this.group.status === "completed") {
      this.contextValue += " completed";
    }

    this.iconPath = getIconForWorkflowRun(this.group);
  }

  getJobs(): WorkflowJobNode[] | WorkflowStepNode[] {
    if (this.group.jobs.length === 1) {
      const jobNode = new WorkflowJobNode(
        this.gitHubRepoContext,
        new WorkflowJob(this.gitHubRepoContext, this.group.jobs[0])
      );
      return jobNode.getSteps();
    }

    return this.group.jobs.map(
      job => new WorkflowJobNode(this.gitHubRepoContext, new WorkflowJob(this.gitHubRepoContext, job))
    );
  }
}
