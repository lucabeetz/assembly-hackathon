import 'server-only';
import EPubViewer from '../../components/epub-viewer'

const EPub = async () => {
    // const router = useRouter()
    // const { id } = router.query

    return (
        <>
            {/* <p>EPub: {id}</p> */}

            <EPubViewer url="/lemon.epub" highlightedLocationID={"epubcfi(/6/12!/4/264[URN:ISBN:9781800241503_Text/007.xhtml_53])"} />
        </>
    )
}

export default EPub