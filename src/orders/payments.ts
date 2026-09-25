export interface PaymentResult {
  paymentId: string;
}

export interface PaymentGateway {
  charge(amount: number, reference: string): Promise<PaymentResult>;
}

/** In-memory gateway that approves every charge, optionally after a simulated delay. */
export class FakePaymentGateway implements PaymentGateway {
  readonly charges: Array<{ amount: number; reference: string }> = [];
  private seq = 0;

  constructor(private readonly latencyMs = 0) {}

  async charge(amount: number, reference: string): Promise<PaymentResult> {
    if (this.latencyMs > 0) await new Promise((resolve) => setTimeout(resolve, this.latencyMs));
    this.charges.push({ amount, reference });
    return { paymentId: `pay_${String(++this.seq).padStart(6, "0")}` };
  }
}
