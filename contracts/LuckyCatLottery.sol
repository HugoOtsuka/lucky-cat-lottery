// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with GSN meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {

  function _msgSender() internal view returns (address payable) {
    return payable(msg.sender);
  }

  function _msgData() internal view returns (bytes memory) {
    this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
    return msg.data;
  }
}

contract LuckyCatLottery is Context {
    
    enum State {
        BETTING,
        CLOSE
    }
    struct Lottery {
        uint id;
		uint creatorFee; 
        uint betPrice;
        uint maxBettors;
        uint prizePool;
        uint endingDate;
		bytes32 password;
		bool privateLottery;
		State currentState;
		address payable lotteryCreator;
        address payable[] bettors;
    }
    mapping(uint => Lottery) public lotteries;
	mapping(address => uint[]) private usersLotteries;
	mapping(address => uint[]) private usersLotteriesBetted;
	mapping(address => mapping(uint => uint)) public usersBets;
    address payable public admin;
    uint public houseFee;
	uint public fundFee;
	bool public createStop = false;
    uint public nextLotteryId;
    
    constructor(uint _housefee, uint _fundFee) {
        _setHouseFee(_housefee);
		_setFundFee(_fundFee);
        admin = _msgSender();
    }
	
    fallback() external {}

	function getLottery(uint lotteryId) external view returns (Lottery memory){
		Lottery memory lottery = lotteries[lotteryId];
		return lottery;
	}
	
	function getEndingDate(uint lotteryId) external view returns (uint){
		Lottery memory lottery = lotteries[lotteryId];
		return lottery.endingDate;
	}
	function getUserBets(address _bettor, uint _lotteryId) external view returns (uint){
		return usersBets[_bettor][_lotteryId];
	}
	
	function getBettors(uint lotteryId) external view returns (address payable[] memory){
		Lottery memory lottery = lotteries[lotteryId];
		return lottery.bettors;
	}
	
	function getActiveLotteries() view external returns(Lottery[] memory) {
        Lottery[] memory _lotteries;
		uint j;
        for(uint i = 0; i < nextLotteryId; i++) {
			if(lotteries[i].currentState == State.BETTING && lotteries[i].privateLottery == false){
				_lotteries[j] = lotteries[i];
				j++;
			}
        }
        return _lotteries;
    }
	
	function getUserLotteries(address _user) view external returns(Lottery[] memory) {
        uint[] memory userLotteriesIds = usersLotteries[_user]; 
        return _getLotteries(userLotteriesIds);
    }
	
	function getUsersLotteriesBetted(address _user) view external returns(Lottery[] memory) {
        uint[] memory userLotteriesIds = usersLotteriesBetted[_user];  
        return _getLotteries(userLotteriesIds);
    }
	
	function _getLotteries(uint[] memory _userLotteriesIds) view internal returns(Lottery[] memory) {
        Lottery[] memory _lotteries = new Lottery[](_userLotteriesIds.length);
        for(uint i = 0; i < _userLotteriesIds.length; i++) {
            uint lotteryId = _userLotteriesIds[i];
            _lotteries[i] = lotteries[lotteryId];
        }
        return _lotteries;
    }
	
    function setHouseFee(uint fee) external onlyAdmin() returns(uint){
        _setHouseFee(fee);
		return houseFee; 
    }
    
    function _setHouseFee(uint fee) private {
        require(fee > 1 && fee < 99, 'Fee should be between 1 and 99');
        houseFee = fee ;
    }
	
	function setFundFee(uint fee) external onlyAdmin() returns(uint){
        _setFundFee(fee);
		return fundFee; 
    }
    
    function _setFundFee(uint fee) private {
        require(fee >= 0 && fee < 99, 'Fee should be between 0 and 99');
        fundFee = fee ;
    }
		
	function setCreateStop() external onlyAdmin() {
        if (createStop == false) {
			createStop = true;
		} else {
			createStop = false;
		}
    }
	
    function createLottery(uint _creatorFee, uint _betPrice, uint _maxBettors, uint _endingDate, bytes32 _password, bool _privateLottery) external returns(uint) {
        uint newLotteryId = _createLottery(_creatorFee, _betPrice, _maxBettors, _endingDate, _password, _privateLottery, _msgSender());
        return newLotteryId;  
    }
    
    function createLotteryAndBet(uint _creatorFee, uint _betPrice, uint _maxBettors, uint _endingDate, bytes32 _password, bool _privateLottery, uint salt) external payable returns(uint) {
        uint newLotteryId = _createLottery(_creatorFee, _betPrice, _maxBettors, _endingDate, _password, _privateLottery, _msgSender());
        _bet(newLotteryId, _msgSender(), msg.value, salt, _password);
		return newLotteryId;  
    }
    
    function _createLottery(uint _creatorFee, uint _betPrice, uint _maxBettors, uint _endingDate, bytes32 _password, bool _privateLottery, address payable _lotteryCreator) private returns(uint) {
        require(createStop == false, 'The creation of new lotteries has been stopped');
		require(_betPrice >= 1000, 'The bet price should be superior or equal to 1000 WEI');
		require(_creatorFee >= 0 && _creatorFee < 99, 'The creator fee should be between 0 and 99');  
		address payable[] memory _bettors = new address payable[](0);
        lotteries[nextLotteryId] = Lottery (
            nextLotteryId,
			_creatorFee,   
            _betPrice,
            _maxBettors,
            0,
            _endingDate,
			keccak256(abi.encodePacked(_password)),
			_privateLottery,
			State.BETTING,
			_lotteryCreator,
            _bettors
        );
		usersLotteries[_lotteryCreator].push(nextLotteryId);
        nextLotteryId ++;
        return nextLotteryId - 1;
    }
    
    function bet(uint _lotteryId, uint salt, bytes32 _password) external payable{
        _bet(_lotteryId, _msgSender(), msg.value, salt, _password);
    }
    
    function _bet(uint _lotteryId, address payable _bettor, uint _amountSent, uint salt, bytes32 _password) private inState(_lotteryId, State.BETTING){
        Lottery storage lottery = lotteries[_lotteryId];
		require(keccak256(abi.encodePacked(_password)) == lottery.password, 'Wrong password');
        require(_amountSent == lottery.betPrice, 'The value sent should be exactly the bet price');
        require(block.timestamp < lottery.endingDate, 'The lottery as ended');
        uint feeSent = _amountSent * houseFee / 100;
        admin.transfer(feeSent);
        uint realAmount = _amountSent - feeSent;
        lottery.prizePool = lottery.prizePool + realAmount;
        lottery.bettors.push(_bettor);
		if (usersBets[_bettor][_lotteryId] == 0) {
			usersLotteriesBetted[_bettor].push(_lotteryId);
		}
		usersBets[_bettor][_lotteryId] = usersBets[_bettor][_lotteryId] + 1; 		
        if (lottery.bettors.length == lottery.maxBettors) {
            _winnerPicker(_lotteryId, salt);
        }
    }
    
    function fundPrizePool(uint _lotteryId) external payable{
        Lottery storage lottery = lotteries[_lotteryId];
		uint amountSent = msg.value;
		uint feeSent = amountSent * fundFee / 100;
        admin.transfer(feeSent);
        uint realAmount = amountSent - feeSent;
        lottery.prizePool = lottery.prizePool + realAmount;
    }
    
    function claimPrize(uint _lotteryId, uint salt) external inState(_lotteryId, State.BETTING){
        require(block.timestamp * 1000 > lotteries[_lotteryId].endingDate, 'The lottery is not ended yet');
		_winnerPicker(_lotteryId, salt);
    }
    
    function _winnerPicker(uint _lotteryId, uint salt) internal {
        Lottery storage lottery = lotteries[_lotteryId];
        lottery.currentState = State.CLOSE;
		if(lottery.bettors.length > 0) {		
			if(lottery.creatorFee > 0) {
				uint feeAmount = (lottery.prizePool * lottery.creatorFee) / 100;
				lottery.lotteryCreator.transfer(feeAmount);
				lottery.prizePool = lottery.prizePool - feeAmount;
			}
			uint winner = _randomModulo(lottery.bettors.length, salt);
			lottery.bettors[winner].transfer(lottery.prizePool);  
		}
    }
    
    function _randomModulo(uint modulo, uint salt) view internal returns(uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, salt))) % modulo;
    }
    
    modifier onlyAdmin() {
        require(_msgSender() == admin, 'Only admin');
        _;
    }
    
    modifier inState(uint _lotteryId, State state) {
        require(state == lotteries[_lotteryId].currentState, 'The lottery is finished and the prize already distributed' );
        _;
    }
}