import {GitHubRepoContext} from "../git/repository";
import * as model from "../model";

export class WorkflowJobGroup {
  readonly _name: string;
  readonly jobs: model.WorkflowJob[];
  private gitHubRepoContext: GitHubRepoContext;

  constructor(gitHubRepoContext: GitHubRepoContext, name: string, jobs: model.WorkflowJob[]) {
    this.gitHubRepoContext = gitHubRepoContext;
    this._name = name;
    this.jobs = jobs;
  }

  get name(): string {
    return `${this._name} (${this.jobs.length})`;
  }

  get status(): model.WorkflowJob["status"] {
    const uniqueStatuses = new Set(this.jobs.map(job => job.status));
    if (uniqueStatuses.size === 1) {
      return this.jobs[0].status;
    }
    if (uniqueStatuses.has("queued")) {
      return "queued";
    }
    if (uniqueStatuses.has("in_progress")) {
      return "in_progress";
    }
    return "completed";
  }

  get conclusion(): model.WorkflowJob["conclusion"] {
    const uniqueConclusions = new Set(this.jobs.map(job => job.conclusion));
    if (uniqueConclusions.size === 1) {
      return this.jobs[0].conclusion;
    }
    if (uniqueConclusions.has("cancelled")) {
      return "cancelled";
    }
    return "failure";
  }
}
