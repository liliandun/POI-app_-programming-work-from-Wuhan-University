import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("开始填充演示数据...");

  // 清空现有数据（按依赖顺序）
  await prisma.discussionMessage.deleteMany();
  await prisma.discussion.deleteMany();
  await prisma.message.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.poi.deleteMany();
  await prisma.user.deleteMany();

  // 创建用户
  const collector = await prisma.user.create({
    data: {
      openId: "dev-collector",
      nickname: "采集者（开发）",
      avatar: "",
      role: "COLLECTOR",
    },
  });

  const verifier = await prisma.user.create({
    data: {
      openId: "dev-verifier",
      nickname: "核验者（开发）",
      avatar: "",
      role: "VERIFIER",
    },
  });

  const admin = await prisma.user.create({
    data: {
      openId: "dev-admin",
      nickname: "管理员（开发）",
      avatar: "",
      role: "ADMIN",
    },
  });

  // 创建 POI 数据
  const poisData = [
    {
      name: "星巴克（中关村店）",
      category: "餐饮服务",
      description: "位于中关村核心区域的星巴克咖啡店，提供咖啡、茶饮及轻食服务。店面面积约120平方米，设有室内座位40余个。",
      longitude: 116.31629,
      latitude: 39.99289,
      address: "北京市海淀区中关村大街1号",
      status: "PENDING" as const,
    },
    {
      name: "海底捞（望京店）",
      category: "餐饮服务",
      description: "海底捞火锅望京旗舰店，24小时营业，提供正宗四川火锅。",
      longitude: 116.48120,
      latitude: 39.99856,
      address: "北京市朝阳区望京街10号",
      status: "FLAGGED" as const,
    },
    {
      name: "北京大学西门",
      category: "教育文化",
      description: "北京大学主要入口之一，毗邻颐和园路，是校园标志性地点。",
      longitude: 116.29810,
      latitude: 39.99300,
      address: "北京市海淀区颐和园路5号",
      status: "APPROVED" as const,
    },
    {
      name: "国家图书馆",
      category: "教育文化",
      description: "中国国家图书馆，亚洲规模最大的图书馆，馆藏超过3700万册。",
      longitude: 116.31930,
      latitude: 39.94180,
      address: "北京市海淀区中关村南大街33号",
      status: "APPROVED" as const,
    },
    {
      name: "故宫博物院",
      category: "旅游景点",
      description: "明清两代的皇家宫殿，世界上现存规模最大、保存最为完整的木质结构古建筑群。",
      longitude: 116.39700,
      latitude: 39.91700,
      address: "北京市东城区景山前街4号",
      status: "CORRECTED" as const,
    },
    {
      name: "三里屯太古里",
      category: "购物服务",
      description: "北京著名时尚购物区，汇集国际品牌与潮流店铺，是年轻人聚集的潮流地标。",
      longitude: 116.45400,
      latitude: 39.93300,
      address: "北京市朝阳区三里屯路19号",
      status: "PENDING" as const,
    },
    {
      name: "天安门广场",
      category: "旅游景点",
      description: "世界上最大的城市广场之一，中国的标志性建筑和重要的政治文化中心。",
      longitude: 116.39140,
      latitude: 39.90890,
      address: "北京市东城区东长安街",
      status: "APPROVED" as const,
    },
    {
      name: "西单大悦城",
      category: "购物服务",
      description: "位于西单商业街的大型购物中心，集购物、餐饮、娱乐于一体。",
      longitude: 116.37400,
      latitude: 39.91100,
      address: "北京市西城区西单北大街131号",
      status: "PENDING" as const,
    },
    {
      name: "清华大学正门",
      category: "教育文化",
      description: "清华大学主校门，是清华园的标志性入口，位于清华路上。",
      longitude: 116.32600,
      latitude: 39.99900,
      address: "北京市海淀区双清路30号",
      status: "APPROVED" as const,
    },
    {
      name: "北京协和医院",
      category: "医疗保健",
      description: "中国顶尖的综合性三甲医院，始建于1921年，是中国现代医学的重要发源地。",
      longitude: 116.41300,
      latitude: 39.91200,
      address: "北京市东城区帅府园1号",
      status: "PENDING" as const,
    },
  ];

  const pois = [];
  for (const data of poisData) {
    const poi = await prisma.poi.create({
      data: { ...data, photos: [], collectorId: collector.id },
    });
    pois.push(poi);
  }

  // 创建核验记录
  const v1 = await prisma.verification.create({
    data: {
      poiId: pois[1].id, // 海底捞
      verifierId: verifier.id,
      errorDescription: "位置坐标与实际门店偏差约200米，建议更新经纬度。同时门头照片有遮挡，建议重新拍摄。",
      newLongitude: 116.48320,
      newLatitude: 39.99960,
      status: "PENDING",
    },
  });

  const v2 = await prisma.verification.create({
    data: {
      poiId: pois[4].id, // 故宫
      verifierId: verifier.id,
      errorDescription: "分类应为「旅游景点」而非原来的「政府机构」，故宫主要功能是旅游参观。",
      newCategory: "旅游景点",
      status: "DISPUTED",
    },
  });

  await prisma.verification.create({
    data: {
      poiId: pois[7].id, // 西单大悦城
      verifierId: verifier.id,
      errorDescription: "照片模糊，无法辨识门头信息，建议重新拍摄清晰照片。",
      status: "ACCEPTED",
    },
  });

  await prisma.verification.create({
    data: {
      poiId: pois[8].id, // 清华大学
      verifierId: verifier.id,
      errorDescription: "描述信息与实际不符，清华正门目前已经翻新。",
      newDescription: "清华大学主校门，经2024年翻新后焕然一新，是清华园的标志性入口。",
      status: "REJECTED",
    },
  });

  // 创建讨论（故宫分类争议）
  const discussion = await prisma.discussion.create({
    data: {
      poiId: pois[4].id,
      verificationId: v2.id,
      status: "OPEN",
    },
  });

  // 讨论消息
  const chatMessages = [
    { userId: verifier.id, content: "该 POI 的分类标注为「政府机构」，但实际应为「旅游景点」。故宫博物院虽隶属文化部门，但其主要功能是旅游参观。" },
    { userId: collector.id, content: "我在采集时参考的是行政机构分类，故宫确实属于文化和旅游部管辖。" },
    { userId: verifier.id, content: "但从使用场景来看，查询 POI 的用户更期望在「旅游景点」分类下找到故宫，而不是「政府机构」。" },
    { userId: collector.id, content: "有道理，但我认为目前的分类体系可能需要支持多标签。这个问题可能需要管理员裁定。" },
    { userId: verifier.id, content: "同意，请管理员介入裁定。" },
  ];

  for (const msg of chatMessages) {
    await prisma.discussionMessage.create({
      data: {
        discussionId: discussion.id,
        userId: msg.userId,
        content: msg.content,
      },
    });
  }

  // 创建消息通知
  await prisma.message.create({
    data: {
      fromUserId: verifier.id,
      toUserId: collector.id,
      type: "ERROR_NOTIFY",
      content: `您采集的 POI「海底捞（望京店）」被核验者标记了错误：位置坐标偏差约200米。`,
      poiId: pois[1].id,
    },
  });

  await prisma.message.create({
    data: {
      fromUserId: admin.id,
      toUserId: collector.id,
      type: "SYSTEM",
      content: "欢迎使用 POI Collector 平台，请按时完成数据采集任务。",
    },
  });

  await prisma.message.create({
    data: {
      fromUserId: collector.id,
      toUserId: verifier.id,
      type: "RESULT_NOTIFY",
      content: `采集者已接受您对「西单大悦城」的核验意见，照片已重新上传。`,
      poiId: pois[7].id,
    },
  });

  await prisma.message.create({
    data: {
      fromUserId: collector.id,
      toUserId: verifier.id,
      type: "RESULT_NOTIFY",
      content: `采集者已驳回您对「清华大学正门」的核验意见：描述信息已于昨日更新。`,
      poiId: pois[8].id,
    },
  });

  console.log("演示数据填充完成！");
  console.log(`  用户: ${3} 个`);
  console.log(`  POI: ${pois.length} 个`);
  console.log(`  核验记录: 4 个`);
  console.log(`  讨论: 1 个（含 ${chatMessages.length} 条消息）`);
  console.log(`  通知消息: 4 条`);
}

main()
  .catch((e) => {
    console.error("填充数据失败:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
