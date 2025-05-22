const ModalSkeleton = () => {

    const skeletonContacts = Array(3).fill(null);

    return (
        skeletonContacts.map((contact) => {
            return (
                <div className="flex flex-row">
                    <div className="flex w-52 flex-col gap-4">
                        <div className="flex items-center gap-4 my-3">
                            <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                            <div className="flex flex-col gap-4">
                                <div className="skeleton h-4 w-55"></div>
                                <div className="skeleton h-4 w-28"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    )
}

export default ModalSkeleton