import { UserRepository } from '../repositories/UserRepository.js';
import { hashPassword, verifyPassword, generateToken } from '../utils/auth.js';

export class AuthService {
    private userRepo = new UserRepository();

    async register(data: any) {
        const { email, password, role, firstName, lastName } = data;
        
        const existingUser = await this.userRepo.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const passwordHash = hashPassword(password);
        
        const user = await this.userRepo.create({
            email,
            passwordHash,
            role,
            firstName,
            lastName
        });

        // Omit passwordHash from response
        const { passwordHash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async login(data: any) {
        const { email, password } = data;
        
        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        if (!verifyPassword(password, user.passwordHash)) {
            throw new Error('Invalid credentials');
        }

        const token = generateToken({ id: user.id, role: user.role, email: user.email });
        
        const { passwordHash: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
}
