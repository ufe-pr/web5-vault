"use client";

import useCreateCatalog from "@/hooks/useCreateCatalog";
import { useRouter } from "next/navigation";

export default function AddCatalogPage() {
  const createCatalog = useCreateCatalog();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const id = await createCatalog(name, description);
    console.log("New catalog:", id);
    router.push(`/catalog/${id}`);
  };
  return (
    <div>
      <h1>Create your Catalog</h1>
      <form onSubmit={handleSubmit} className="mt-8">
        <label className="block mt-4">
          <span className="text-black">Name</span>
          <input name="name" id="name" type="text" className="form-input mt-1 block w-full" />
        </label>
        <label className="block mt-4">
          <span className="text-black">Description</span>
          <input name="description" id="description" type="text" className="form-input mt-1 block w-full" />
        </label>
        <div className="mt-4">
          <button type="submit" className="btn">Submit</button>
        </div>
      </form>
    </div>
  );
}
