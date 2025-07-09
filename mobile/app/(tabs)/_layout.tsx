@@ .. @@
       />
       <Tabs.Screen
         name="profile"
         options={{
           title: 'Profile',
           tabBarIcon: ({ size, color }) => (
             <User size={size} color={color} />
           ),
         }}
       />
+      <Tabs.Screen
+        name="(user)"
+        options={{
+          href: null, // Hide from tab bar
+        }}
+      />
     </Tabs>
   );
 }