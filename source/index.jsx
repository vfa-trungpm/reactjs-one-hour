const Constants = {
	GRID_SIDE: 20,
	TILE_COUNT: 20
};

var View = React.createClass({
	style: {
		background: 'black',
		width: 400,
		height: 400,
		position: 'relative'
	},

	getInitialState: function() {
		return {
			ax: 15,
			ay: 15
		};
	},

	componentDidMount: function() {
		this.interval = setInterval(this.update, 1000 / 15);
	},

	componentWillUnmount: function() {
		clearInterval(this.interval);
	},

	render: function() {
		return (
			<div style={ this.style }>
				<Snake checkCollide={ this.checkCollide } />
				<Square x={ this.state.ax } y={ this.state.ay } background="red" />
			</div>
		);
	},

	update: function() {
		this.forceUpdate();
	},

	checkCollide: function(x, y) {
		if (x == this.state.ax && y == this.state.ay) {
			var x = Math.floor(Math.random() * Constants.GRID_SIDE);
			var y = Math.floor(Math.random() * Constants.GRID_SIDE);

			this.setState({
				ax: x,
				ay: y
			});

			return true;
		}

		return false;
	}
});

var Square = React.createClass({
	getInitialState: function() {
		return {
			background: this.props.background,
			width: 18,
			height: 18,
			margin: 1,
			position: 'absolute'
		};
	},

	componentDidMount: function() {
		this.update(this.props);
	},

	componentWillReceiveProps: function(nextProps) {
		this.update(nextProps);
	},

	render: function() {
		return (
			<div style={ this.state } ></div>
		);
	},

	update: function(props) {
		this.setState({
			left: props.x * Constants.GRID_SIDE,
			top: props.y * Constants.GRID_SIDE
		});
	}
});

var Snake = React.createClass({
	x: 10,
	y: 10,
	vx: 0,
	vy: 0,
	tail: 5,

	getInitialState: function() {
		return {
			trail: []
		}
	},

	componentDidMount: function() {
		window.document.addEventListener('keydown', this.inputHandle);
	},

	componentWillReceiveProps: function() {
		this.update();
	},

	inputHandle: function(e) {
		switch (e.keyCode) {
			case 37:
				if (this.vx == 1) return;
				this.vx = -1;
				this.vy = 0;
				break;
			case 38:
				if (this.vy == 1) return;
				this.vx = 0;
				this.vy = -1;
				break;
			case 39:
				if (this.vx == -1) return;
				this.vx = 1;
				this.vy = 0;
				break;
			case 40:
				if (this.vy == -1) return;
				this.vx = 0;
				this.vy = 1;
				break;
		}
	},
	render: function() {
		return (
			<div>
				{ this.state.trail.map(function(item, index) {
					return <Square x={ item.x } y={ item.y } background="lime" key={ index } />
				}) }
			</div>
		);
	},
	update: function() {
		this.x += this.vx;
		this.y += this.vy;

		if (this.x > Constants.TILE_COUNT - 1) this.x = 0;
		else if (this.x < 0) this.x = Constants.TILE_COUNT - 1;

		if (this.y > Constants.TILE_COUNT - 1) this.y = 0;
		else if (this.y < 0) this.y = Constants.TILE_COUNT - 1;

		var trail = this.state.trail;

		for (let i=0; i<trail.length; i++) {
			if (trail[i].x == this.x && trail[i].y == this.y) {
				this.tail = 5;
				break;
			}
		}

		if (this.props.checkCollide(this.x, this.y)) {
			this.tail++;
		}

		trail.push({ x: this.x, y: this.y });

		while (trail.length > this.tail) {
			trail.shift();
		}

		this.setState({
			trail: trail
		});
	}
});

ReactDOM.render(<View />, document.getElementById('main'));













