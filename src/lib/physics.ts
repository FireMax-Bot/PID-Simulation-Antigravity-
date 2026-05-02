export function computeDistance(x1: number, z1: number, x2: number, z2: number): number {
  const dx = x2 - x1;
  const dz = z2 - z1;
  return Math.sqrt(dx * dx + dz * dz);
}

export function computeTargetHeading(x1: number, z1: number, x2: number, z2: number): number {
  const dx = x2 - x1;
  const dz = z2 - z1;
  return Math.atan2(dz, dx);
}

export function computeLinearVelocity(dist: number, error: number, baseSpeed: number): number {
  return dist > 0.1 ? Math.max(0, baseSpeed * Math.cos(error)) : 0;
}
