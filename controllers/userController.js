// Simulated database (in real app, this would be MongoDB)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', createdAt: new Date().toISOString() },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: new Date().toISOString() },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', createdAt: new Date().toISOString() }
];

class UserController {
  // GET all users
  static getAllUsers(req, res) {
    try {
      res.json({
        success: true,
        count: users.length,
        data: users,
        message: 'Users retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // GET user by ID
  static getUserById(req, res) {
    try {
      const user = users.find(u => u.id === parseInt(req.params.id));
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user,
        message: 'User retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // CREATE new user
  static createUser(req, res) {
    try {
      const { name, email, role = 'user' } = req.body;
      
      // Validation
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: 'Name and email are required'
        });
      }

      // Check if email already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }

      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      users.push(newUser);
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // UPDATE user
  static updateUser(req, res) {
    try {
      const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
      
      if (userIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const updatedUser = {
        ...users[userIndex],
        ...req.body,
        updatedAt: new Date().toISOString()
      };

      users[userIndex] = updatedUser;
      
      res.json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // DELETE user
  static deleteUser(req, res) {
    try {
      const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
      
      if (userIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const deletedUser = users.splice(userIndex, 1)[0];
      
      res.json({
        success: true,
        message: 'User deleted successfully',
        data: deletedUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // GET user statistics
  static getUserStats(req, res) {
    try {
      const totalUsers = users.length;
      const adminCount = users.filter(u => u.role === 'admin').length;
      const userCount = users.filter(u => u.role === 'user').length;
      
      res.json({
        success: true,
        data: {
          totalUsers,
          adminCount,
          userCount,
          roles: {
            admin: adminCount,
            user: userCount
          }
        },
        message: 'User statistics retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
}

module.exports = UserController;