import { useNavigate } from "react-router-dom"


export const columns = [
    {
        name: "S No",
        selector: (row) => row.sno
    },
    {
        name: "Team Name",
        selector: (row) => row.teamname_id,
       
    },
    {
        name: "Description",
        selector: (row) => row.description,
      
    },
    {
        name: "Action",
        selector: (row) => row.actions,
    }
]

export const TeamButtons = ({_id}) => {
    const navigate = useNavigate()
    return (
        <div className="flex gap-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => navigate(`/admin-dashboard/team/${_id}`)}
            >Edit</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
        </div>
    )
}