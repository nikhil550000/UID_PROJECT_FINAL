import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  Mail, 
  Shield, 
  UserCheck, 
  UserX,
  Calendar,
  Search,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { userApi, User, CreateUserInput, UpdateUserInput } from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<CreateUserInput>({
    name: '',
    email: '',
    password: '',
    role: 'employee'
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editData, setEditData] = useState<UpdateUserInput>({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  // Load users from API
  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await userApi.getAll();
      if (response.success && response.data) {
        setUsers(response.data);
        setFilteredUsers(response.data);
      } else {
        toast({ 
          title: "Error loading users", 
          description: response.error || "Failed to load users",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast({ 
        title: "Error loading users", 
        description: "Failed to connect to server",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Filter users based on search and filters
  const filterUsers = useCallback(() => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        statusFilter === 'active' ? user.is_active : !user.is_active
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({ 
        title: "Validation Error", 
        description: "Please fill in all required fields",
        variant: "destructive" 
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await userApi.create(newUser);
      if (response.success) {
        toast({ title: "User created successfully!" });
        setNewUser({ name: '', email: '', password: '', role: 'employee' });
        loadUsers();
      } else {
        toast({ 
          title: "Error creating user", 
          description: response.error,
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({ 
        title: "Error creating user", 
        description: "Failed to create user",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      setIsLoading(true);
      const response = await userApi.update(editingUser.email, editData);
      if (response.success) {
        toast({ title: "User updated successfully!" });
        setEditingUser(null);
        setEditData({});
        loadUsers();
      } else {
        toast({ 
          title: "Error updating user", 
          description: response.error,
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast({ 
        title: "Error updating user", 
        description: "Failed to update user",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      setIsLoading(true);
      const response = await userApi.delete(email);
      if (response.success) {
        toast({ title: "User deleted successfully!" });
        loadUsers();
      } else {
        toast({ 
          title: "Error deleting user", 
          description: response.error,
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({ 
        title: "Error deleting user", 
        description: "Failed to delete user",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await userApi.toggleStatus(email);
      if (response.success) {
        toast({ title: response.message || "User status updated successfully!" });
        loadUsers();
      } else {
        toast({ 
          title: "Error updating user status", 
          description: response.error,
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({ 
        title: "Error updating user status", 
        description: "Failed to update user status",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (user: User) => {
    setEditingUser(user);
    setEditData({
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditData({});
  };

  const getUserStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.is_active).length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const employerUsers = users.filter(u => u.role === 'employer').length;

    return { totalUsers, activeUsers, adminUsers, employerUsers };
  };

  const stats = getUserStats();

  if (isLoading && users.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage system users and their access permissions</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={loadUsers}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Users className="w-4 h-4" />
            Refresh Users
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Active Users</p>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Admins</p>
                <p className="text-2xl font-bold">{stats.adminUsers}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Employers</p>
                <p className="text-2xl font-bold">{stats.employerUsers}</p>
              </div>
              <Users className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filter Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="employer">Employer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                Showing {filteredUsers.length} of {users.length} users
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New User */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New User
          </CardTitle>
          <CardDescription>Create a new user account with appropriate role and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <Input
                placeholder="Enter full name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <Input
                type="email"
                placeholder="Enter email address"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password *</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <Select 
                value={newUser.role} 
                onValueChange={(value) => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMPLOYEE">Employee</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleCreateUser}
                disabled={isLoading || !newUser.name || !newUser.email || !newUser.password}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Users List
          </CardTitle>
          <CardDescription>Manage existing users and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
              <p className="text-gray-600">
                {users.length === 0 
                  ? "No users have been created yet. Add your first user above." 
                  : "No users match your current filter criteria."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.email}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {editingUser?.email === user.email ? (
                    // Edit mode
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Name</label>
                          <Input
                            value={editData.name || ''}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <Input
                            type="email"
                            value={editData.email || ''}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Role</label>
                          <Select 
                            value={editData.role || ''} 
                            onValueChange={(value) => setEditData({ ...editData, role: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EMPLOYEE">Employee</SelectItem>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Status</label>
                          <Select 
                            value={editData.is_active ? 'active' : 'inactive'} 
                            onValueChange={(value) => setEditData({ ...editData, is_active: value === 'active' })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleUpdateUser} disabled={isLoading}>
                          Save Changes
                        </Button>
                        <Button onClick={cancelEdit} variant="outline">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-lg font-semibold">{user.name}</h3>
                          <div className="flex gap-2">
                            <Badge
                              variant={user.role === 'admin' ? 'default' : 'secondary'}
                            >
                              {user.role.toUpperCase()}
                            </Badge>
                            <Badge
                              variant={user.is_active ? 'default' : 'destructive'}
                              className={user.is_active ? 'bg-green-100 text-green-800' : ''}
                            >
                              {user.is_active ? 'ACTIVE' : 'INACTIVE'}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Created: {new Date(user.created_at || '').toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(user)}
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(user.email)}
                          className={user.is_active ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}
                        >
                          {user.is_active ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUser(user.email)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
