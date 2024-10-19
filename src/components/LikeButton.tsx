'use client';

import { toggleLikeDog } from '@/app/actions/likeActions';
import { useRouter } from 'next/navigation';
import React from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

type Props = {
  targetUserId: string,
  hasLiked: boolean,
}

export default function LikeButton({targetUserId, hasLiked}: Props) {
  const router = useRouter();
  
  async function toggleLike() {
    await toggleLikeDog(targetUserId, hasLiked);
    router.refresh(); // used to refresh the UI after the like has been toggled
  }

  return (
    <div onClick={toggleLike} className='relative hover:opacity-80 transition cursor-pointer'>
      <AiOutlineHeart size={28} className='fill-white absolute -top-[2px] -right-[2px]'/>
      <AiFillHeart size={24} className={hasLiked ? 'fill-rose-500' : 'fill-nuetral-500/70'}/>
    </div>
  )
}
