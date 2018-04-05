class Api::CartsController < ApplicationController
  before_action :set_cart, only: [:update, :destroy]

  # GET /carts
  # GET /carts.json
  def index
    @carts = current_user.carts
  end

  def create
    @cart = Cart.new(cart_params)
    @cart.user_id = current_user.id
    @cart.save!
    render :show
  end

  def update
    if @cart.update(cart_params)
      render :show
    else
      render json: @cart.errors.full_messages, status: 422
    end
  end

  def sort
    carts = params[:carts]
    carts = fetchDescriptions(carts)
    result = lda(parser(carts.keys.map{|key| carts[key][:description]}))
    @carts = []
    result.each.with_index do |el, i|
      cart = params[:carts][i.to_s]
      category = 0
      if el[0].is_a? Float
        max = el[0]
        el.each.with_index do |e, j|
          if e > max
            category = j + 1
            max = e
          end
        end
      end
      Cart.find(cart[:id]).update({category: category.to_s})
      cart = Cart.find(cart[:id])
      @carts.push(cart)
    end
    render :index
  end

  def destroy
    @cart.destroy
    user = User.find(current_user.id)
    @carts = user.carts
    render :index
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_cart
      @cart = Cart.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def cart_params
      params.require(:cart).permit(:user_id, :job_id, :category, :description)
    end
end

def fetchDescriptions(cart)
  driver = Selenium::WebDriver.for :chrome
  driver.navigate.to "https://www.linkedin.com/"
  while driver.current_url[0, 29] != "https://www.linkedin.com/feed"
    sleep(1)
  end
  wait = Selenium::WebDriver::Wait.new(:timeout => 60)
  urls = cart.keys.map{|key| cart[key][:url]}

  urls.each_with_index do |link, i|
    driver.navigate.to link
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    view_more = driver.find_elements(css: '.view-more-icon')[0]
    begin
      view_more.click()
    rescue

    end
    desc_container = driver.find_elements(css: '#job-details *')
    desc = []
    desc_container.each do |e|
      begin
        desc.push(e.text)
      rescue
        desc.push("")
      end
    end
    description = desc.join(' ').gsub(/[^A-Za-z ]/, ' ').gsub(/\s+/, ' ').downcase
    cart[i.to_s][:description] = description
    Job.find(cart[i.to_s][:job_id]).update({description: description})
  end
  driver.quit()
  return cart
end

def parser(corpus)
  stopwords = ['the','of','and','to','a','in','for','is','on','that','by','this','with','i','you','it','not','or','be','are','from','at','as','your','all','have','new','more','an','was','we','will','home','can','us','about','if','page','my','has','search','free','but','our','one','other','do','no','information','time','they','site','he','up','may','what','which','their','news','out','use','any','there','see','only','so','his','when','contact','here','business','who','web','also','now','help','get','pm','view','online','c','e','first','am','been','would','how','were','me','s','services','some','these','click','its','like','service','x','than','find','price','date','back','top','people','had','list','name','just','over','state','year','day','into','email','two','health','n','world','re','next','used','go','b','work','last','most','products','music','buy','data','make','them','should','product','system','post','her','city','t','add','policy','number','such','please','available','copyright','support','message','after','best','software','then','jan','good','video','well','d','where','info','rights','public','books','high','school','through','m','each','links','she','review','years','order','very','privacy','book','items','company','r','read','group','need','many','user','said','de','does','set','under','general','research','university','january','mail','full','map','reviews','program','life','know','games','way','days','management','p','part','could','great','united','hotel','real','f','item','international','center','ebay','must','store','travel','comments','made','development','report','off','member','details','line','terms','before','hotels','did','send','right','type','because','local','those','using','results','office','education','national','car','design','take','posted','internet','address','community','within','states','area','want','phone','dvd','shipping','reserved','subject','between','forum','family','l','long','based','w','code','show','o','even','black','check','special','prices','website','index','being','women','much','sign','file','link','open','today','technology','south','case','project','same','pages','uk','version','section','own','found','sports','house','related','security','both','g','county','american','photo','game','members','power','while','care','network','down','computer','systems','three','total','place','end','following','download','h','him','without','per','access','think','north','resources','current','posts','big','media','law','control','water','history','pictures','size','art','personal','since','including','guide','shop','directory','board','location','change','white','text','small','rating','rate','government','children','during','usa','return','students','v','shopping','account','times','sites','level','digital','profile','previous','form','events','love','old','john','main','call','hours','image','department','title','description','non','k','y','insurance','another','why','shall','property','class','cd','still','money','quality','every','listing','content','country','private','little','visit','save','tools','job','work','few','look','u','work','experience','working','employment','skills','team','poster','premium','strong']
  data = []
  count = 0
  word_frequency = Hash.new(0)

  corpus.each_with_index do |text, i|
    count += 1
    text = text.split(' ').map!{|x| x.gsub(/(\W|\d)/, '')}
    stopwords.each_with_index do |word, i|
      text = text.reject{|s| s == word}
    end

    text.uniq.each do |word|
      word_frequency[word] += 1
    end
    data << text
  end

  word_frequency.each do |k, v|
    if v > (0.4 * count)
      data.map!.with_index do |x, idx|
        x.reject{|w| w == k}
      end
    end
  end

  return data
end

def lda(text)
  corpus = Lda::Corpus.new

  text.each do |description|
    corpus.add_document(Lda::TextDocument.new(corpus, description.join(' ')))
  end

  lda = Lda::Lda.new(corpus)
  lda.verbose = false
  lda.num_topics = 5
  lda.max_iter = 100
  lda.init_alpha = 0.8
  lda.em('random')
  topics = lda.top_words(10)
  matrix = lda.compute_topic_document_probability
  topics.each do |topic|
    puts '****'
    puts topic
  end

  return matrix
end
