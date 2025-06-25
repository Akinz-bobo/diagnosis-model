export const getCurrentUserDetail = async () => {
  const res = await fetch("/api/auth/me");
  const result = await res.json();
  console.log("Result: ", result);
  return {
    id: result.id,
    name: result.full_name,
    email: result.email,
    phone: result.phone,
    role: result.role,
    organization_id: result.organization_id,
    image: result.image,
  };
};
