export const employees = [
    {
        id: 1,
        name: "Ashok",
        department: "IT",
        email: "example",
        username: "ashok",
        password: "A123456"
    },
    {
        id: 2,
        name: "Prabhu",
        department: "HR",
        email: "example",
        username: "prabhu",
        password: "P123456"
    },
    {
        id: 3,
        name: "Nagarajan",
        department: "Finance",
        email: "example",
        username: "nagarajan",
        password: "N123456"
    },
    {
        id: 14,
        name: "Sathya",
        department: "Marketing",
        email: "example",
        username: "sathya",
        password: "S123456"
    }
].sort((a, b) => a.name.localeCompare(b.name));
