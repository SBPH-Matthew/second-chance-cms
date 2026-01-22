"use client";
import { Edit } from "@carbon/icons-react";
import { User } from "@carbon/pictograms-react";
import { Button, Tile } from "@carbon/react";
import { useState } from "react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data - replace with actual data from API
  const userProfile = {
    name: "Matthew Andre Butalid",
    email: "matthewandrebutalid@gmail.com",
    userId: "matthewandrebutalid@gmail.com",
    password: "••••••••••••",
    language: "English",
  };

  return (
    <div className="p-8! min-h-screen!">
      <h1 className="text-3xl! font-lighter! mb-8! text-white!">Profile</h1>

      <div className="max-w-2xl!">
        {/* Contact Information Card */}
        <Tile className="p-2! px-4! mb-6! border! border-white/20!">
          {" "}
          {/* Use Tile Carbon component */}
          {/* Header */}
          <div className="flex! items-center! justify-between! mb-6!">
            <h2 className="text-lg! font-normal! text-white! m-0!">
              Contact Information
            </h2>
            <Button
              kind="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-400! hover:text-blue-300!"
            >
              <span className="flex! items-center! gap-2!">
                Edit <Edit size={16} />
              </span>
            </Button>
          </div>
          <div className="flex! gap-6! mb-6! py-4! mt-12!">
            {/* Avatar */}
            <div className="shrink-0!">
              <div className="size-56! bg-[#525252]! flex! items-center! justify-center!">
                <div className="size-40! rounded-full! border-2! border-dashed! border-white/20! flex! items-center! justify-center!">
                  <User className="size-14!" />
                </div>
              </div>

              <div className="mt-8!">
                <label className="text-sm! font-semibold! block! mb-1!">
                  Name
                </label>
                <p className="text-xl! font-light! text-white! m-0!">
                  {userProfile.name}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex-1! ms-4!">
              <div className="mb-6!">
                <label className="text-sm! font-semibold! block! mb-2!">
                  User ID
                </label>
                <p className="text-base! m-0!">{userProfile.userId}</p>
              </div>

              <div className="mb-6!">
                <label className="text-sm! font-semibold! block! mb-2!">
                  Password
                </label>
                <p className="text-base! m-0!">{userProfile.password}</p>
              </div>

              <div className="mb-6!">
                <label className="text-sm! font-semibold! block! mb-2!">
                  Email
                </label>
                <p className="text-base! m-0!">{userProfile.email}</p>
              </div>

              <div>
                <label className="text-sm! font-semibold! block! mb-2!">
                  Language
                </label>
                <p className="text-base! m-0!">{userProfile.language}</p>
              </div>
            </div>
          </div>
        </Tile>
      </div>
    </div>
  );
}
