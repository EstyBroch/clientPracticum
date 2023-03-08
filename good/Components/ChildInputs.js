
export default ({ index }) => {

    return (
        <div className=" form-row form-group row">
            <div className="col control-label col-sm-3 ">

                <label className="control-label col-sm-6">שם</label>
                <div className="col-sm-10">
                    <input type="text" className="form-control " name={`child${index}Name`}
                        defaultValue={sessionStorage.getItem(`child${index}Name`)} onInput={(e) => {
                            sessionStorage.setItem(`child${index}Name`, e.target.value)
                        }}
                    />
                </div>
            </div>

            <div className="col control-label col-sm-3 ">
                <label className="control-label col-sm-6">מספר זהות</label>
                <div className="col-sm-10">
                    <input type="text" className="form-control" name={`child${index}idNumber`}
                        defaultValue={sessionStorage.getItem(`child${index}idNumber`)} onInput={(e) => {
                            sessionStorage.setItem(`child${index}idNumber`, e.target.value)
                        }}
                    />
                </div>
            </div>

            <div className="col control-label col-sm-3">
                <label className="control-label col-sm-6">תאריך לידה</label>
                <div className="col-sm-10">
                    <input type="date" className="form-control" name={`child${index}DateOfBirth`} defaultValue={sessionStorage.getItem(`child${index}DateOfBirth`)}
                        onInput={(e) => { sessionStorage.setItem(`child${index}DateOfBirth`, e.target.value) }}
                    />
                </div>
            </div>
            <label className={`child{index}error`} id={`child{index}error`} style={{display:"visible"}}>שדה חובה</label>
        </div>
    )

}