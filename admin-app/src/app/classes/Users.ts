export class User {
    constructor(
        public _id: string = "",
        public Name: string = "",
        public Email: string = "",
        public Password?: string, // Note the question mark to make it optional
        public Phone?: string,  // Make optional to match interface
        public Address?: string  // Make optional to match interface
    ) {}
}