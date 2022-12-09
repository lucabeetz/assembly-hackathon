import 'server-only';

import supabase from '../../utils/supabase';
import VideoList from "../../components/video-list";

export const revalidate = 0;

const Library = async () => {
  const { data, error } = await supabase.from('videos').select('*');

  return (
    <div>
      <h1>Library</h1>
      <VideoList videos={data} />
    </div>
  );
};

export default Library;