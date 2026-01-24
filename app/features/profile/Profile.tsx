"use client";
import { Button, Tile, SkeletonPlaceholder, SkeletonText } from "@carbon/react";
import { Edit } from "@carbon/icons-react";
import { useState } from "react";
import { useProfile } from "./hooks/useProfile";
import { User } from "@carbon/pictograms-react";
import { getImageUrl } from "@/app/utils/imageUrl";
import { ProfileEditForm, ChangePasswordForm } from "./components";

export const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: profileData, isPending } = useProfile();

  const userProfile = profileData?.user;

  if (isPending) {
    return (
      <div className="p-8! min-h-screen!">
        <h1 className="text-3xl! font-lighter! mb-8! text-white!">Profile</h1>
        <div className="max-w-2xl!">
          <Tile className="p-2! px-4! mb-6! border! border-white/20!">
            <div className="flex! items-center! justify-between! mb-6!">
              <SkeletonText heading width="150px" className="m-0!" />
            </div>
            <div className="flex! gap-6! mb-6! py-4! mt-12!">
              <div className="shrink-0!">
                <SkeletonPlaceholder className="size-56!" />
                <div className="mt-8!">
                  <SkeletonText width="60px" className="mb-2!" />
                  <SkeletonText width="180px" />
                </div>
              </div>
              <div className="flex-1! ms-4! space-y-6!">
                <div>
                  <SkeletonText width="80px" className="mb-2!" />
                  <SkeletonText width="220px" />
                </div>
                <div>
                  <SkeletonText width="80px" className="mb-2!" />
                  <SkeletonText width="150px" />
                </div>
                <div>
                  <SkeletonText width="80px" className="mb-2!" />
                  <SkeletonText width="200px" />
                </div>
                <div>
                  <SkeletonText width="80px" className="mb-2!" />
                  <SkeletonText width="100%" paragraph lineCount={2} />
                </div>
              </div>
            </div>
          </Tile>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="p-8! min-h-screen!">
        <h1 className="text-3xl! font-lighter! mb-8! text-white!">Profile</h1>
        <div className="max-w-2xl!">
          <Tile className="p-2! px-4! mb-6! border! border-white/20!">
            <p className="text-white!">No profile data available</p>
          </Tile>
        </div>
      </div>
    );
  }

  const fullName = `${userProfile.first_name} ${userProfile.last_name}`;

  return (
    <div className="p-8! min-h-screen!">
      <h1 className="text-3xl! font-lighter! mb-8! text-white!">Profile</h1>

      <div className="max-w-2xl!">
        {isEditing ? (
          <>
            <ProfileEditForm
              user={userProfile}
              onCancel={() => setIsEditing(false)}
            />
            <ChangePasswordForm user={userProfile} />
          </>
        ) : (
          /* Contact Information Card */
          <Tile className="p-2! px-4! mb-6! border! border-white/20!">
            {/* Header */}
            <div className="flex! items-center! justify-between! mb-6!">
              <h2 className="text-lg! font-normal! text-white! m-0!">
                Contact Information
              </h2>
              <Button
                kind="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
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
                <div className="size-56! bg-[#525252]! flex! items-center! justify-center! overflow-hidden!">
                  {userProfile.profile_picture ? (
                    <img
                      src={getImageUrl(userProfile.profile_picture)}
                      alt={fullName}
                      className="size-56! object-cover!"
                      onError={(e) => {
                        // Fallback to User icon if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector(".avatar-fallback")) {
                          const fallbackDiv = document.createElement("div");
                          fallbackDiv.className =
                            "avatar-fallback size-40! rounded-full! border-2! border-dashed! border-white/20! flex! items-center! justify-center!";
                          const userIcon = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "svg",
                          );
                          userIcon.setAttribute("width", "56");
                          userIcon.setAttribute("height", "56");
                          userIcon.setAttribute("viewBox", "0 0 32 32");
                          userIcon.setAttribute("fill", "currentColor");
                          userIcon.innerHTML =
                            '<path d="M16 8a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3z"/><path d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm0 26a12 12 0 0 1-10.29-5.79l5.71-5.71a2 2 0 0 1 2.83 0l5.71 5.71A12 12 0 0 1 16 28zm0-24a12 12 0 0 1 10.29 18.79l-5.71-5.71a2 2 0 0 0-2.83 0l-5.71 5.71A12 12 0 0 1 16 4z"/>';
                          fallbackDiv.appendChild(userIcon);
                          parent.appendChild(fallbackDiv);
                        }
                      }}
                    />
                  ) : (
                    <div className="size-40! rounded-full! border-2! border-dashed! border-white/20! flex! items-center! justify-center!">
                      <User className="size-14!" />
                    </div>
                  )}
                </div>

                <div className="mt-8!">
                  <label className="text-sm! font-semibold! block! mb-1!">
                    Name
                  </label>
                  <p className="text-xl! font-light! text-white! m-0!">
                    {fullName}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex-1! ms-4!">
                <div className="mb-6!">
                  <label className="text-sm! font-semibold! block! mb-2!">
                    User ID
                  </label>
                  <p className="text-base! m-0!">{userProfile.email}</p>
                </div>

                <div className="mb-6!">
                  <label className="text-sm! font-semibold! block! mb-2!">
                    Password
                  </label>
                  <p className="text-base! m-0!">••••••••••••</p>
                </div>

                <div className="mb-6!">
                  <label className="text-sm! font-semibold! block! mb-2!">
                    Email
                  </label>
                  <p className="text-base! m-0!">{userProfile.email}</p>
                </div>

                <div className="mb-6!">
                  <label className="text-sm! font-semibold! block! mb-2!">
                    Address
                  </label>
                  <p className="text-base! m-0!">
                    {[
                      userProfile.street_address_1,
                      userProfile.street_address_2,
                      userProfile.state_province,
                      userProfile.country,
                      userProfile.zip_postal_code
                    ].filter(Boolean).join(", ") || "No address provided"}
                  </p>
                </div>

                <div>
                  <label className="text-sm! font-semibold! block! mb-2!">
                    Role
                  </label>
                  <p className="text-base! m-0!">{userProfile.role?.name || "User"}</p>
                </div>
              </div>
            </div>
          </Tile>
        )}
      </div>
    </div>
  );
};
