export interface Vector {
  x: number;
  y: number;
}

export interface Body {
  id: number;
  mass: number;
  radius: number;
  position: Vector;
  velocity: Vector;
  color: string;
  path: Vector[];
}

export enum Preset {
    FIGURE_EIGHT = 'figure_eight',
    BINARY_PLANET = 'binary_planet',
    STABLE_TRIANGLE = 'stable_triangle',
}