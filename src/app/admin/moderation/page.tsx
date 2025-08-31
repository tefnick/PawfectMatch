import { getUnapprovedPhotos } from "@/app/actions/adminActions";
import { Divider } from "@nextui-org/react";
import DogPhotos from "@/components/DogPhotos";

export default async function PhotoModerationPage() {
  const photos = await getUnapprovedPhotos();

  return (
    <div className={"flex flex-col mt-10 gap-3"}>
      <h3 className={"text-2xl"}>Photos awaiting review</h3>
      <Divider />
      <DogPhotos photos={photos} />
    </div>
  );
}
