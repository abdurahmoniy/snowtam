export enum NotificationType {
  REDUCED_RUNWAY_LENGTH = "REDUCED_RUNWAY_LENGTH", // Уменьшенная длина ВПП LDA
  SNOW_BANK_NEAR_RUNWAY = "SNOW_BANK_NEAR_RUNWAY", // Снежная позёмка на ВПП
  SAND_ON_RUNWAY = "SAND_ON_RUNWAY", // Песок на ВПП
  DEBRIS_ON_RUNWAY_LEFT = "DEBRIS_ON_RUNWAY_LEFT", // Сугробы на ВПП Левый от оси ВПП
  DEBRIS_ON_RUNWAY_RIGHT = "DEBRIS_ON_RUNWAY_RIGHT", // Сугробы на ВПП Правый от оси ВПП
  DEBRIS_ON_TAXIWAY_LEFT = "DEBRIS_ON_TAXIWAY_LEFT", // Сугробы на РД Левый от оси ВПП
  DEBRIS_ON_TAXIWAY_RIGHT = "DEBRIS_ON_TAXIWAY_RIGHT", // Сугробы на РД Правый от оси ВПП
  SNOWDRIFTS_NEAR_RUNWAY = "SNOWDRIFTS_NEAR_RUNWAY", // Сугробы вблизи ВПП
  TAXIWAY_POOR_CONDITION = "TAXIWAY_POOR_CONDITION", // РД Плохое
  APRON_POOR_CONDITION = "APRON_POOR_CONDITION", // Перрон Плохое
  OTHER = "OTHER", // Другое

  DEBRIS_ON_RUNWAY = "DEBRIS_ON_RUNWAY", // custom
  DEBRIS_ON_TAXIWAY = "DEBRIS_ON_TAXIWAY",
}

export enum ProcedureType {
  SAND_APPLICATION = "SAND_APPLICATION", // Песок
  CHEMICAL_TREATMENT = "CHEMICAL_TREATMENT", // Реагенты // Хим обработка
  HARD = "HARD",
  LIQUID = "LIQUID",
  BRUSHING = "BRUSHING", // Щетки
  PLOWING = "PLOWING", // PRODUV
  OTHER = "OTHER", // Другое
}

