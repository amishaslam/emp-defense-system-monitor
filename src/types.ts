export interface UserConfig {
  fullname: string;
  email: string;
  projectTitle: string;
  githubRepo: string;
  linkedinProfile: string;
  university: string;
  courseName: string;
  hardwareVersion: string;
}

export interface RadarPoint {
  angle: number;
  distance: number;
  intensity: number; // For trail fade
  isTarget: boolean;
}

export interface RadarTarget {
  angle: number;
  distance: number;
  speed: number;
}
