export type Stat = {
  value: string;
  numericValue: number;
  suffix: string;
  label: string;
  icon: string;
};

export const stats: Stat[] = [
  {
    value: "4+",
    numericValue: 4,
    suffix: "+",
    label: "Years of Experience",
    icon: "📅",
  },
  {
    value: "10+",
    numericValue: 10,
    suffix: "+",
    label: "Production Apps Built",
    icon: "🚀",
  },
  {
    value: "10M+",
    numericValue: 10,
    suffix: "M+",
    label: "Users Served",
    icon: "👥",
  },
  {
    value: "5+",
    numericValue: 5,
    suffix: "+",
    label: "Brands Collaborated",
    icon: "🏢",
  },
];
