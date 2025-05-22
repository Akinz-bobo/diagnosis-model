import { User } from "../types";

export const users: User[] = [
  {
    id: "user-1",
    full_name: "John Doe",
    email: "johndoe@gmail.com",
    role: "admin",
    emailVerified: true,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "user-2",
    full_name: "Jane Smith",
    email: "janesmith@gmail.com",
    role: "user",
    emailVerified: true,
    createdAt: "2023-02-01T00:00:00Z",
  },
  {
    id: "user-3",
    full_name: "Bob Johnson",
    email: "bobjohnson@gmail.com",
    role: "user",
    emailVerified: false,
    createdAt: "2023-03-01T00:00:00Z",
  },
  {
    id: "user-4",
    full_name: "Alice Brown",
    email: "alicebrown@gmail.com",
    role: "user",
    emailVerified: true,
    createdAt: "2023-04-01T00:00:00Z",
  },
];
