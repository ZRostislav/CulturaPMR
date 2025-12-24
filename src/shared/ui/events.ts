// src/events.js
export interface EventItem {
  id: number;
  title: string;
  age: number;
  price: number;
  description: string;
  image: string;
  link: string;

  location: {
    city: string;
    venue: string; // место проведения
    address?: string;
  };

  schedule: {
    date: string; // ISO: YYYY-MM-DD
    times: string[]; // ["10:00", "12:00"]
  }[];
}

export const events: EventItem[] = [
  {
    id: 1,
    title: "Новый год в Стране чудес",
    age: 5,
    price: 35,
    description:
      "Интерактивное представление, детская дискотека, фотосессия с героями, Дед Мороз и Снегурочка.",
    image: "/5335000748242177259.jpg",
    link: "https://vk.com/feed",

    location: {
      city: "Бендеры",
      venue: "Дом культуры",
      address: "ул. Ленина 12",
    },

    schedule: [
      {
        date: "2025-12-24",
        times: ["10:00", "12:00", "14:00"],
      },
    ],
  },
  {
    id: 2,
    title: "Вий",
    age: 16,
    price: 33,
    description:
      "Народный драматический театр, премьера спектакля по мотивам повести Н. В. Гоголя.",
    image: "/5335000748242177260.jpg",
    link: "https://vk.com/feed",

    location: {
      city: "Тирасполь",
      venue: "Дом культуры",
      address: "ул. Панина 54",
    },

    schedule: [
      {
        date: "2025-12-24",
        times: ["10:00", "12:00", "14:00"],
      },
      {
        date: "2025-12-25",
        times: ["12:00", "16:00"],
      },
      {
        date: "2025-12-27",
        times: ["10:00", "14:00"],
      },
    ],
  },
];
