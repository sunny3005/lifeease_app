@@ .. @@
 import { useAuth } from '@/context/AuthContext';
 import { useTheme } from '@/context/ThemeContext';
-import { useNotifications } from '@/context/NotificationContext';
 import {
   Mail,
 }
@@ .. @@
 export default function Profile() {
 }
-  const { user, updateUser, logout, darkMode, toggleDarkMode } = useAuth();
+  const { user, updateUser, logout } = useAuth();
   const { colors } = useTheme();
   const router = useRouter();
@@ .. @@
           <Card.Content>
             <Text style={styles.sectionTitle}>Preferences</Text>
-            <TouchableOpacity style={styles.preferenceRow} onPress={toggleDarkMode}>
-              {darkMode ? <Moon color={colors.primary} size={20} /> : <Sun color={colors.primary} size={20} />}
+            <TouchableOpacity style={styles.preferenceRow} onPress={() => router.push('/(user)/profile')}>
+              <User color={colors.primary} size={20} />
               <View style={styles.infoText}>
-                <Text style={styles.label}>Theme</Text>
-                <Text style={styles.value}>{darkMode ? 'Dark Mode' : 'Light Mode'}</Text>
+                <Text style={styles.label}>Advanced Profile</Text>
+                <Text style={styles.value}>Edit profile with more options</Text>
               </View>
-              <View style={[styles.toggle, darkMode && styles.toggleActive]}>
-                <View style={[styles.toggleThumb, darkMode && styles.toggleThumbActive]}>
-                  {darkMode ? <Moon size={12} color="white" /> : <Sun size={12} color="#64748b" />}
-                </View>
-              </View>
+              <ChevronRight size={20} color={colors.textSecondary} />
             </TouchableOpacity>
           </Card.Content>
         </Card>