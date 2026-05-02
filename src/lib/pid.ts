export class PIDController {
  private integralError: number = 0;
  private previousError: number = 0;
  private maxIntegral: number = 5;

  constructor() {}

  public compute(error: number, dt: number, kp: number, ki: number, kd: number): number {
    const P = kp * error;
    
    // Accumulate integral with anti-windup bounds
    this.integralError = Math.max(
      -this.maxIntegral, 
      Math.min(this.maxIntegral, this.integralError + error * dt)
    );
    const I = ki * this.integralError;
    
    // Compute derivative
    const D = dt > 0 ? kd * ((error - this.previousError) / dt) : 0;
    
    this.previousError = error;
    
    return P + I + D;
  }

  public reset(): void {
    this.integralError = 0;
    this.previousError = 0;
  }
}
