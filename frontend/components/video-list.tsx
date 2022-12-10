'use client';

import { Avatar, Table } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import supabase from '../utils/supabase';

const VideoList = () => {
  const router = useRouter();

  const [videos, setVideos]: any[] = useState([]);

  const getVideos = async () => {
    const { data, error } = await supabase.from('videos').select('*');

    if (data) {
      setVideos(data);
    }
  };

  useEffect(() => {
    getVideos();
  }, []);

  const handleClick = (id: string) => {
    router.push("video/" + id);
  };

  return (
    <Table hoverable striped>
      <Table.Head>
        <Table.HeadCell>
          Thumbnail
        </Table.HeadCell>
        <Table.HeadCell>
          Title
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">

        {videos.map((video: any, index: number) => (
          <Table.Row
            className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
            key={video.id}
            onClick={e => handleClick(video.id)}
          >
            <Table.Cell>
              <Avatar img={video.thumbnail} placeholderInitials="N/A" size="md" />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {video.title}
            </Table.Cell>
          </Table.Row>
        ))}

      </Table.Body>
    </Table>
  );
}

export default VideoList;