export interface IBedAllocationStrategy {
  allocate(beds: any[], patient: any): any | null;
}

export class ICUAllocationStrategy implements IBedAllocationStrategy {
  allocate(beds: any[], patient: any): any | null {
    // Priority: ICU first, then nothing (strict for critical) 
    // or ICU only according to some rules.
    return beds.find(b => b.type === 'ICU' && !b.isOccupied) || null;
  }
}

export class GeneralAllocationStrategy implements IBedAllocationStrategy {
  allocate(beds: any[], patient: any): any | null {
    // Priority: General beds only
    return beds.find(b => b.type === 'GENERAL' && !b.isOccupied) || null;
  }
}

export class BedAllocator {
  private strategy: IBedAllocationStrategy;

  constructor(strategy: IBedAllocationStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: IBedAllocationStrategy) {
    this.strategy = strategy;
  }

  executeAllocation(beds: any[], patient: any) {
    return this.strategy.allocate(beds, patient);
  }
}
