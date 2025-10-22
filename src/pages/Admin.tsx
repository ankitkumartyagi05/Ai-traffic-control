import { useEffect, useState } from "react";
import { Header } from "@/components/Layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, UserPlus, Trash2, Users, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Admin = () => {
  const { user, isAdmin, isOwner } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    loadData();
  }, [user, isAdmin]);

  const loadData = async () => {
    try {
      // Load all user roles
      const { data: roles } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (roles) {
        setUserRoles(roles);
      }

      // Load profiles for display
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profiles) {
        setUsers(profiles);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find user by email from profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_id')
        .ilike('full_name', `%${newAdminEmail}%`)
        .single();

      if (!profile) {
        toast({
          title: "User Not Found",
          description: "No user found with that identifier.",
          variant: "destructive",
        });
        return;
      }

      // Use secure backend edge function
      const { data, error } = await supabase.functions.invoke('admin-operations', {
        body: {
          action: 'add_role',
          targetUserId: profile.user_id,
          role: 'admin'
        }
      });

      if (error) {
        if (error.message?.includes('23505') || error.message?.includes('already')) {
          toast({
            title: "Already Admin",
            description: "This user is already an admin.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Admin Added",
        description: "User has been granted admin privileges.",
      });

      setNewAdminEmail("");
      loadData();
    } catch (error: any) {
      console.error('Error adding admin:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    try {
      // Get role details first
      const { data: roleData, error: fetchError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .eq('id', roleId)
        .single();

      if (fetchError || !roleData) throw fetchError || new Error('Role not found');

      // Use secure backend edge function
      const { data, error } = await supabase.functions.invoke('admin-operations', {
        body: {
          action: 'remove_role',
          targetUserId: roleData.user_id,
          role: roleData.role
        }
      });

      if (error) throw error;

      toast({
        title: "Role Removed",
        description: "User role has been removed.",
      });

      loadData();
    } catch (error: any) {
      console.error('Error removing role:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getRoleForUser = (userId: string) => {
    return userRoles.find(r => r.user_id === userId);
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.user_id === userId);
    return user?.full_name || 'Unknown User';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center space-x-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage users and system settings</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Admins</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userRoles.filter(r => r.role === 'admin').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Owners</CardTitle>
                <Shield className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userRoles.filter(r => r.role === 'owner').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add Admin */}
          {isOwner && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Add New Admin
                </CardTitle>
                <CardDescription>
                  Grant admin privileges to a user (owner only)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="adminEmail">User Name or Email</Label>
                    <Input
                      id="adminEmail"
                      placeholder="Enter user name"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddAdmin}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Admin
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* User Roles Table */}
          <Card>
            <CardHeader>
              <CardTitle>User Roles</CardTitle>
              <CardDescription>Manage user permissions and roles</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Granted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">
                        {getUserName(role.user_id)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={role.role === 'owner' ? 'default' : 'secondary'}>
                          {role.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(role.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {isOwner && role.role !== 'owner' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRole(role.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Warning for Owner */}
          {isOwner && (
            <Card className="border-status-warning">
              <CardHeader>
                <CardTitle className="flex items-center text-status-warning">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Owner Privileges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  As the owner, you have full control over the system including adding/removing admins.
                  Use these privileges responsibly.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
