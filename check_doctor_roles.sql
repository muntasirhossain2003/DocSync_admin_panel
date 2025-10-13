-- Check all users and their roles
SELECT 
    id,
    email,
    role,
    full_name,
    created_at
FROM users
ORDER BY created_at DESC;

-- Count users by role
SELECT 
    role,
    COUNT(*) as count
FROM users
GROUP BY role;

-- Check if the doctor you added has the correct role
SELECT 
    id,
    email,
    role,
    full_name
FROM users
WHERE email LIKE '%doctor%' OR role = 'doctor';
