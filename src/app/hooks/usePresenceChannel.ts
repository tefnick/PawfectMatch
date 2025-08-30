import { useCallback, useEffect, useRef } from "react";
import usePresenceStore from "./usePresenceStore";
import { Channel, Members } from "pusher-js";
import { pusherClient } from "@/lib/pusher";
import { useShallow } from "zustand/shallow";
import { updateLastActive } from "../actions/dogActions";

export const usePresenceChannel = (
  userId: string | null,
  profileComplete: boolean
) => {
  const { set, add, remove } = usePresenceStore(
    useShallow((state) => ({
      set: state.set,
      add: state.add,
      remove: state.remove,
    }))
  );

  const channelRef = useRef<Channel | null>(null);

  const handleSetMembers = useCallback(
    (memberIds: string[]) => {
      set(memberIds);
    },
    [set]
  );

  const handleAddMember = useCallback(
    (memberId: string) => {
      add(memberId);
    },
    [add]
  );

  const handleRemoveMember = useCallback(
    (memberId: string) => {
      remove(memberId);
    },
    [remove]
  );

  useEffect(() => {
    if (!userId || !profileComplete) return;
    if (!channelRef.current) {
      console.log(
        "channelRef.current is null, subscribing to presence-dogs channel"
      );
      channelRef.current = pusherClient.subscribe("presence-dogs");
      channelRef.current.bind(
        "pusher:subscription_succeeded",
        async (members: Members) => {
          handleSetMembers(Object.keys(members.members));
          await updateLastActive();
        }
      );

      channelRef.current.bind(
        "pusher:member_added",
        (member: { id: string }) => {
          handleAddMember(member.id);
        }
      );

      channelRef.current.bind(
        "pusher:member_removed",
        (member: { id: string }) => {
          handleRemoveMember(member.id);
        }
      );
    }
    console.log("channelRef.current:", channelRef.current);

    return () => {
      if (channelRef.current && channelRef.current.subscribed) {
        channelRef.current.unsubscribe();
        channelRef.current.unbind_all();
      }
    };
  }, [
    handleAddMember,
    handleRemoveMember,
    handleSetMembers,
    userId,
    profileComplete,
  ]);
};
