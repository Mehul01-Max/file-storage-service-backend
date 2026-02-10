export declare const register: (email: string, password: string, name: string) => Promise<{
    id: string;
    email: string;
    name: string;
    created_at: Date;
}>;
export declare const login: (email: string, password: string) => Promise<{
    user: {
        id: string;
        name: string;
        email: string;
        created_at: Date;
    };
    token: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map