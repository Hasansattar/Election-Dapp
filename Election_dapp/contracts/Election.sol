// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

contract Election {
    //struct condidate
    struct Candidate {
        uint256 id; //1
        string name;
        uint256 voteCount;
    }
    //candidate count
    uint256 public candidateCount; //2
    //mapping candidate for accees the particular candidate
    mapping(uint256 => Candidate) public candidates; //3

    //this mapping tell us that address has voted or not
    mapping(address => bool) public voteornot;

    event electionupdated(
        uint256 indexed id,
        string indexed name,
        uint256 indexed voteCount
    );

    //constructor
    constructor() {
        //the code that we want to initiate
        //imran khan and zardari
        addCandidate("imram khan");
        addCandidate("zardari");
    }

    // add Candidates

    function addCandidate(string memory name) private {
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, name, 0);
    }

    function Vote(uint256 _id) public {
        //  the person has not voted again
        require(!voteornot[msg.sender], "you have vote for participant");
        // the id that the person has input is avaliable
        require(candidates[_id].id != 0, "the id doesnot exit");

        //increase the vote count of the person whom the
        candidates[_id].voteCount += 1;
        //bool true record that voter has voted
        voteornot[msg.sender] = true;
        // triger voted event
        emit electionupdated(
            _id,
            candidates[_id].name,
            candidates[_id].voteCount
        );
    }
}
