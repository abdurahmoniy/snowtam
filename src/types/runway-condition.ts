export type contaminationCoverage =
  'LESS_THAN_10_PERCENT' |
  'BETWEEN_10_AND_25_PERCENT' |
  'MORE_THAN_25_PERCENT'

export type surfaceCondition = 'DRY' | 'WET' | 'ICE' | 'SNOW'

export interface RunwayConditionCreateRequest {
  contaminationCoverage: contaminationCoverage;
  rurunwayThirds: RunwayThird[];
  situationalNotification: SituationalNotification
  improvementProcedure: ImprovementProcedure
}

export interface RunwayThird {
  rwycValue: number;
  percent: string;
  depth: string;
  surfaceCondition: surfaceCondition
}

export interface ContaminationDetail {
}

export interface SituationalNotification {
  /** Уменьшенная длина ВПП LDA (м) */
  reducedLdaLength?: number;

  /** Снежная позёмка на ВПП */
  snowDriftOnRunway?: boolean;

  /** Песок на ВПП */
  sandOnRunway?: boolean;

  /** Сугробы на ВПП: расстояния L/П от оси (м) */
  runwaySnowdriftDistances?: {
    leftFromCenterline: number;
    rightFromCenterline: number;
  };

  /** Сугробы на РД: расстояния L/П от оси (м) */
  taxiwaySnowdriftDistances?: {
    leftFromCenterline: number;
    rightFromCenterline: number;
  };

  /** Сугробы вблизи ВПП */
  snowdriftsNearRunway?: boolean;

  /** «РД ___ Плохое»: указать название/код РД */
  poorTaxiway?: string;

  /** «Перрон ___ Плохое»: указать номер/код перрона */
  poorApron?: string;

  /** Другое (если просто флаг) */
  other?: boolean;

  /** Другое (описание) */
  otherText?: string;
}

export interface ImprovementProcedure {
  /** Химическая обработка ВПП */
  chemicalTreatment?: boolean;

  /** Насыпка песка */
  sand?: boolean;

  /** Щеточная обработка */
  brushing?: boolean;

  /** Предув (сдувка) */
  preblow?: boolean;

  /** Время применения процедуры (ISO-строка или Date) */
  applicationTime?: string;

  /** Выбранное устройство (ID или название) */
  device?: string;
}

export interface RunwayConditionCreateResponse {
  status: string;
  message: string;
  data: any; // Adjust if you know the response shape
}

export interface RunwayCondition {
}