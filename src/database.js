// Mock Database Service
// In a real application, this would connect to a real database

class DatabaseService {
  constructor() {
    this.users = this.loadUsers();
    this.initializeDefaultUsers();
  }

  // Load users from localStorage
  loadUsers() {
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : [];
  }

  // Save users to localStorage
  saveUsers() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  // Initialize with some default users for testing
  initializeDefaultUsers() {
    if (this.users.length === 0) {
      const defaultUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@gmail.com',
          password: this.hashPassword('Password123'),
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@gmail.com',
          password: this.hashPassword('Password123'),
          createdAt: new Date().toISOString()
        }
      ];
      
      this.users = defaultUsers;
      this.saveUsers();
      console.log('🗄️ Default users initialized for testing');
      console.log('📧 Test emails: john.doe@gmail.com, jane.smith@gmail.com');
      console.log('🔑 Test password: Password123');
    }
  }

  // Simple password hashing (in production, use bcrypt or similar)
  hashPassword(password) {
    // This is a simple hash for demonstration - NOT secure for production
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  // Verify password
  verifyPassword(password, hashedPassword) {
    return this.hashPassword(password) === hashedPassword;
  }

  // Create new user
  createUser(userData) {
    const existingUser = this.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: this.hashPassword(userData.password),
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    this.saveUsers();
    
    console.log('✅ User created successfully:', {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    });

    return { ...newUser, password: undefined }; // Don't return password
  }

  // Find user by email
  findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  // Authenticate user
  authenticateUser(email, password) {
    const user = this.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = this.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    console.log('✅ User authenticated successfully:', {
      id: user.id,
      name: user.name,
      email: user.email
    });

    return { ...user, password: undefined }; // Don't return password
  }

  // Update user password
  updatePassword(email, newPassword) {
    const userIndex = this.users.findIndex(user => user.email === email);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users[userIndex].password = this.hashPassword(newPassword);
    this.users[userIndex].updatedAt = new Date().toISOString();
    this.saveUsers();

    console.log('✅ Password updated successfully for:', email);
    return true;
  }

  // Get all users (for admin purposes)
  getAllUsers() {
    return this.users.map(user => ({ ...user, password: undefined }));
  }

  // Delete user (for testing)
  deleteUser(email) {
    const userIndex = this.users.findIndex(user => user.email === email);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const deletedUser = this.users.splice(userIndex, 1)[0];
    this.saveUsers();
    
    console.log('🗑️ User deleted:', email);
    return { ...deletedUser, password: undefined };
  }

  // Clear all users (for testing)
  clearAllUsers() {
    this.users = [];
    this.saveUsers();
    console.log('🗑️ All users cleared');
  }
}

// Export singleton instance
const database = new DatabaseService();
export default database;
