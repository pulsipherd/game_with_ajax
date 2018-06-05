class GamesController < ApplicationController
  before_action :set_game, only: [:show, :update, :destroy]

  def index
    @games = Game.all
  end

  def show
  end

  def create
    @game = Game.new(game_params)
    if @game.save
      render json: @game
    else
      render_error(@game)
    end
  end

  def update
    if @game.update(game_params)
      render json: @game
    else
      render_error(@game)
    end
  end

  def destroy
    @game.destroy
    render json: { message: 'See ya!'}, status: :ok
  end

  def form
    @game = params[:id] ? Game.find(params[:id]) : Game.new
    render partial: 'form'
  end

  def show
    render partial: 'game', locals: { game: @game }
  end

  private
    def set_game
      @game = Game.find(params[:id])
    end

    def game_params
      params.require(:game).permit(:name, :description)
    end
end
