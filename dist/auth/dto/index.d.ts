export declare enum UserRole {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    FINANCE = "FINANCE",
    SUPPORT = "SUPPORT"
}
export declare class SignupDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    tenantId: string;
    role?: UserRole;
}
export declare class LoginDto {
    email: string;
    password: string;
    tenantId: string;
}
