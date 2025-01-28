"use client";

import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        priority
        width={48}
        height={48}
        src="/images/logo.svg"
        alt={`${APP_NAME} logo`}
      />

      <div className="p-6 rounded-lg w-1/3 shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Not Found</h1>
        <p className="text-destructive">Could not find requested page</p>
        <Button
          onClick={() => (window.location.href = "/")}
          variant="outline"
          className="mt-4 ml-2"
        >Back to Home</Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
