import 'server-only';

import VideoList from "../../components/video-list";

export const revalidate = 0;

const Library = async () => {
  return (
    <div>
      <h1>Library</h1>
      <VideoList />
    </div>
  );
};

export default Library;