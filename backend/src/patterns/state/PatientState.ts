export abstract class PatientState {
  protected context: PatientContext;

  constructor(context: PatientContext) {
    this.context = context;
  }

  abstract getStatus(): string;

  toWaiting(): void {
    this.invalidTransition('WAITING');
  }

  toAdmitted(): void {
    this.invalidTransition('ADMITTED');
  }

  toUnderTreatment(): void {
    this.invalidTransition('UNDER_TREATMENT');
  }

  toDischarge(): void {
    this.invalidTransition('DISCHARGED');
  }

  protected invalidTransition(target: string): void {
    throw new Error(`Invalid state transition from ${this.getStatus()} to ${target}`);
  }
}

export class PatientContext {
  private state: PatientState;
  private patientData: any;

  constructor(initialState: string, patientData: any) {
    this.patientData = patientData;
    this.state = this.createStateFromStatus(initialState);
  }

  setState(state: PatientState): void {
    this.state = state;
  }

  getStatus(): string {
    return this.state.getStatus();
  }

  transition(newStatus: string): void {
    switch (newStatus) {
      case 'WAITING': this.state.toWaiting(); break;
      case 'ADMITTED': this.state.toAdmitted(); break;
      case 'UNDER_TREATMENT': this.state.toUnderTreatment(); break;
      case 'DISCHARGED': this.state.toDischarge(); break;
      default: throw new Error(`Unknown status: ${newStatus}`);
    }
  }

  private createStateFromStatus(status: string): PatientState {
    switch (status) {
      case 'REGISTERED': return new RegisteredState(this);
      case 'WAITING': return new WaitingState(this);
      case 'ADMITTED': return new AdmittedState(this);
      case 'UNDER_TREATMENT': return new UnderTreatmentState(this);
      case 'DISCHARGED': return new DischargedState(this);
      default: throw new Error(`Invalid initial status: ${status}`);
    }
  }
}

export class RegisteredState extends PatientState {
  getStatus(): string { return 'REGISTERED'; }
  toWaiting(): void { this.context.setState(new WaitingState(this.context)); }
  toAdmitted(): void { this.context.setState(new AdmittedState(this.context)); }
}

export class WaitingState extends PatientState {
  getStatus(): string { return 'WAITING'; }
  toAdmitted(): void { this.context.setState(new AdmittedState(this.context)); }
}

export class AdmittedState extends PatientState {
  getStatus(): string { return 'ADMITTED'; }
  toUnderTreatment(): void { this.context.setState(new UnderTreatmentState(this.context)); }
  toDischarge(): void { this.context.setState(new DischargedState(this.context)); }
}

export class UnderTreatmentState extends PatientState {
  getStatus(): string { return 'UNDER_TREATMENT'; }
  toDischarge(): void { this.context.setState(new DischargedState(this.context)); }
}

export class DischargedState extends PatientState {
  getStatus(): string { return 'DISCHARGED'; }
  // End of lifecycle
}
