import React from 'react'

const Leaderboard = () => {
    return(
        <table className="leader-board-table">
                <tr>
                  <th className='lead-th'>Rank</th>
                  <th className='lead-th'>Name</th>
                  <th className='lead-th'>College</th>
                  <th className='lead-th'>Sessions</th>
                  <th className='lead-th'>Rating</th>
                </tr>
                <tr className='lead-tr'>
                  <td className='lead-td'>1</td>
                  <td className='lead-td'>John Doe</td>
                  <td className='lead-td'>XYZ University</td>
                  <td className='lead-td'>50</td>
                  <td className='lead-td'>4.9</td>
                </tr>
                <tr className='lead-tr'>
                  <td className='lead-td'>1</td>
                  <td className='lead-td'>John Doe</td>
                  <td className='lead-td'>XYZ University</td>
                  <td className='lead-td'>50</td>
                  <td className='lead-td'>4.9</td>
                </tr>
                <tr className='lead-tr'>
                  <td className='lead-td'>1</td>
                  <td className='lead-td'>John Doe</td>
                  <td className='lead-td'>XYZ University</td>
                  <td className='lead-td'>50</td>
                  <td className='lead-td'>4.9</td>
                </tr>
              </table>
    )
}

export default Leaderboard