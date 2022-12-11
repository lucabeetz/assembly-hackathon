import 'server-only';
import EPubViewer from '../../components/epub-viewer'

const EPub = async () => {
    // const router = useRouter()
    // const { id } = router.query

    return (
        <>
            {/* <p>EPub: {id}</p> */}

            <EPubViewer url="/lemon.epub" />
        </>
    )
}

export default EPub